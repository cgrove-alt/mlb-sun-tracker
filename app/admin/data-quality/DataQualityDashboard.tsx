'use client';

import { useEffect, useState } from 'react';
import {
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Database,
  Users,
  Activity,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface StadiumView {
  stadiumId: string;
  stadiumName: string;
  views: number;
  uniqueVisitors: number;
  lastViewed: number;
  league: string;
}

interface DataFreshnessStats {
  current: number;
  good: number;
  stale: number;
  outdated: number;
  byLeague: {
    mlb: { current: number; good: number; stale: number; outdated: number; total: number };
    milb: { current: number; good: number; stale: number; outdated: number; total: number };
  };
}

interface StadiumNeedingUpdate {
  stadiumId: string;
  lastUpdated: string;
  daysSince: number;
  notes: string;
  league: string;
}

interface FeedbackSummary {
  totalFeedback: number;
  totalStadiums: number;
  issueTypeDistribution: Record<string, number>;
  statusDistribution: {
    new: number;
    reviewed: number;
    resolved: number;
  };
}

export default function DataQualityDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'views' | 'quality' | 'feedback'>('overview');

  // Data states
  const [stadiumViews, setStadiumViews] = useState<StadiumView[]>([]);
  const [viewsSummary, setViewsSummary] = useState<any>(null);
  const [dataFreshness, setDataFreshness] = useState<DataFreshnessStats | null>(null);
  const [stadiumsNeedingUpdate, setStadiumsNeedingUpdate] = useState<StadiumNeedingUpdate[]>([]);
  const [feedbackSummary, setFeedbackSummary] = useState<FeedbackSummary | null>(null);
  const [stadiumsWithIssues, setStadiumsWithIssues] = useState<any[]>([]);

  const fetchAnalytics = async () => {
    setRefreshing(true);
    try {
      // Fetch stadium views
      const viewsRes = await fetch('/api/admin/analytics/stadium-views');
      const viewsData = await viewsRes.json();
      setStadiumViews(viewsData.topStadiums || []);
      setViewsSummary(viewsData.summary);

      // Fetch data quality
      const qualityRes = await fetch('/api/admin/analytics/data-quality');
      const qualityData = await qualityRes.json();
      setDataFreshness(qualityData.dataFreshness?.stats || null);
      setStadiumsNeedingUpdate(qualityData.dataFreshness?.stadiumsNeedingUpdate || []);

      // Fetch user feedback
      const feedbackRes = await fetch('/api/admin/analytics/user-feedback');
      const feedbackData = await feedbackRes.json();
      setFeedbackSummary(feedbackData.summary || null);
      setStadiumsWithIssues(feedbackData.stadiumsWithIssues || []);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Data Quality Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor stadium data quality and user engagement</p>
            </div>
            <button
              onClick={fetchAnalytics}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'views', label: 'Stadium Views', icon: Activity },
              { id: 'quality', label: 'Data Quality', icon: Database },
              { id: 'feedback', label: 'User Feedback', icon: Users },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Activity}
                title="Total Views"
                value={viewsSummary?.totalViews?.toLocaleString() || 0}
                subtitle={`${viewsSummary?.totalStadiums || 0} stadiums`}
                color="bg-blue-500"
              />
              <StatCard
                icon={Users}
                title="Unique Visitors"
                value={viewsSummary?.totalUniqueVisitors?.toLocaleString() || 0}
                subtitle={`Avg ${viewsSummary?.averageViewsPerStadium || 0} views/stadium`}
                color="bg-green-500"
              />
              <StatCard
                icon={Database}
                title="Data Freshness"
                value={`${dataFreshness ? Math.round(((dataFreshness.current + dataFreshness.good) / (dataFreshness.current + dataFreshness.good + dataFreshness.stale + dataFreshness.outdated)) * 100) : 0}%`}
                subtitle={`${dataFreshness?.current || 0} current`}
                color="bg-purple-500"
              />
              <StatCard
                icon={AlertTriangle}
                title="User Reports"
                value={feedbackSummary?.totalFeedback || 0}
                subtitle={`${feedbackSummary?.statusDistribution?.new || 0} unreviewed`}
                color="bg-orange-500"
              />
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Data Freshness */}
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-purple-500" />
                  Data Freshness Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Current (&lt;6 months)</span>
                    </div>
                    <span className="font-semibold text-gray-900">{dataFreshness?.current || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="text-gray-700">Good (6-12 months)</span>
                    </div>
                    <span className="font-semibold text-gray-900">{dataFreshness?.good || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                      <span className="text-gray-700">Stale (1-2 years)</span>
                    </div>
                    <span className="font-semibold text-gray-900">{dataFreshness?.stale || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-gray-700">Outdated (&gt;2 years)</span>
                    </div>
                    <span className="font-semibold text-gray-900">{dataFreshness?.outdated || 0}</span>
                  </div>
                </div>
              </div>

              {/* Top Viewed Stadiums */}
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  Top Viewed Stadiums
                </h3>
                <div className="space-y-2">
                  {stadiumViews.slice(0, 5).map((stadium, idx) => (
                    <div key={stadium.stadiumId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center">
                        <span className="text-xs font-semibold text-gray-500 w-6">{idx + 1}.</span>
                        <span className="text-sm text-gray-700">{stadium.stadiumName}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{stadium.views.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stadium Views Tab */}
        {activeTab === 'views' && (
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Stadium Page Views</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stadium</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">League</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Views</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unique Visitors</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Last Viewed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stadiumViews.map((stadium, idx) => (
                      <tr key={stadium.stadiumId} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm text-gray-900">{idx + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{stadium.stadiumName}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            stadium.league === 'mlb' ? 'bg-blue-100 text-blue-800' :
                            stadium.league === 'milb' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {stadium.league.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{stadium.views.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{stadium.uniqueVisitors.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-500">
                          {new Date(stadium.lastViewed).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Data Quality Tab */}
        {activeTab === 'quality' && (
          <div className="space-y-6">
            {/* Freshness by League */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* MLB */}
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">MLB Data Freshness</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Current</span>
                    <span className="font-semibold text-green-600">{dataFreshness?.byLeague.mlb.current || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Good</span>
                    <span className="font-semibold text-blue-600">{dataFreshness?.byLeague.mlb.good || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Stale</span>
                    <span className="font-semibold text-yellow-600">{dataFreshness?.byLeague.mlb.stale || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Outdated</span>
                    <span className="font-semibold text-red-600">{dataFreshness?.byLeague.mlb.outdated || 0}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">{dataFreshness?.byLeague.mlb.total || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MiLB */}
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">MiLB Data Freshness</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Current</span>
                    <span className="font-semibold text-green-600">{dataFreshness?.byLeague.milb.current || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Good</span>
                    <span className="font-semibold text-blue-600">{dataFreshness?.byLeague.milb.good || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Stale</span>
                    <span className="font-semibold text-yellow-600">{dataFreshness?.byLeague.milb.stale || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Outdated</span>
                    <span className="font-semibold text-red-600">{dataFreshness?.byLeague.milb.outdated || 0}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">{dataFreshness?.byLeague.milb.total || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stadiums Needing Update */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Stadiums Needing Update</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stadium</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">League</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Days Since</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stadiumsNeedingUpdate.map(stadium => (
                        <tr key={stadium.stadiumId} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{stadium.stadiumId}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              stadium.league === 'mlb' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {stadium.league.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{stadium.lastUpdated}</td>
                          <td className="px-4 py-3 text-sm text-right">
                            <span className={`font-semibold ${
                              stadium.daysSince > 730 ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {stadium.daysSince}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{stadium.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            {/* Feedback Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-sm text-gray-600 mb-2">Total Feedback</h3>
                <p className="text-3xl font-bold text-gray-900">{feedbackSummary?.totalFeedback || 0}</p>
                <p className="text-xs text-gray-500 mt-1">{feedbackSummary?.totalStadiums || 0} stadiums affected</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-sm text-gray-600 mb-2">Unreviewed</h3>
                <p className="text-3xl font-bold text-orange-600">{feedbackSummary?.statusDistribution?.new || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Requires attention</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-sm text-gray-600 mb-2">Resolved</h3>
                <p className="text-3xl font-bold text-green-600">{feedbackSummary?.statusDistribution?.resolved || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Completed</p>
              </div>
            </div>

            {/* Stadiums with Most Issues */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Stadiums with Most Reports</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stadium</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Reports</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Types</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stadiumsWithIssues.map(stadium => (
                        <tr key={stadium.stadiumId} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{stadium.stadiumName}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                            {stadium.totalReports}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {Object.entries(stadium.byIssueType).map(([type, count]) => (
                              <span key={type} className="inline-flex items-center px-2 py-1 mr-2 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                                {type}: {count as number}
                              </span>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
