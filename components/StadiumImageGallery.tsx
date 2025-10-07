'use client';

import { useState, useCallback } from 'react';
import OptimizedImage from './OptimizedImage';

interface StadiumImage {
  src: string;
  alt: string;
  caption?: string;
}

interface StadiumImageGalleryProps {
  stadiumName: string;
  images: StadiumImage[];
}

export default function StadiumImageGallery({
  stadiumName,
  images
}: StadiumImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleImageClick = useCallback((index: number) => {
    setSelectedImage(index);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const handlePrevious = useCallback(() => {
    setSelectedImage((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null
    );
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedImage((prev) =>
      prev !== null ? (prev + 1) % images.length : null
    );
  }, [images.length]);

  return (
    <>
      <div className="stadium-gallery">
        <h3 className="gallery-title">{stadiumName} Photos</h3>
        <div className="gallery-grid">
          {images.map((image, index) => (
            <button
              key={index}
              className="gallery-item"
              onClick={() => handleImageClick(index)}
              aria-label={`View ${image.alt}`}
            >
              <OptimizedImage
                src={image.src}
                alt={image.alt}
                width={300}
                height={200}
                className="gallery-thumbnail"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={60}
              />
              {image.caption && (
                <span className="image-caption">{image.caption}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="lightbox" onClick={handleClose}>
          <button
            className="lightbox-close"
            onClick={handleClose}
            aria-label="Close lightbox"
          >
            ×
          </button>
          <button
            className="lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className="lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next image"
          >
            ›
          </button>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <OptimizedImage
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              width={1200}
              height={800}
              className="lightbox-image"
              priority
              quality={85}
            />
            {images[selectedImage].caption && (
              <p className="lightbox-caption">
                {images[selectedImage].caption}
              </p>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .stadium-gallery {
          margin: 2rem 0;
        }

        .gallery-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: var(--color-text-primary);
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .gallery-item {
          position: relative;
          border: none;
          background: none;
          padding: 0;
          cursor: pointer;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .gallery-item:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .image-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          color: white;
          padding: 1rem;
          font-size: 0.9rem;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .gallery-item:hover .image-caption {
          opacity: 1;
        }

        .lightbox {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s;
        }

        .lightbox-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: white;
          font-size: 3rem;
          cursor: pointer;
          z-index: 10001;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .lightbox-close:hover {
          transform: scale(1.1);
        }

        .lightbox-prev,
        .lightbox-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          font-size: 3rem;
          cursor: pointer;
          z-index: 10001;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .lightbox-prev:hover,
        .lightbox-next:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .lightbox-prev {
          left: 20px;
        }

        .lightbox-next {
          right: 20px;
        }

        .lightbox-content {
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lightbox-caption {
          color: white;
          margin-top: 1rem;
          text-align: center;
          font-size: 1rem;
          padding: 0 1rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: 1fr;
          }

          .lightbox-prev,
          .lightbox-next {
            width: 40px;
            height: 40px;
            font-size: 2rem;
          }

          .lightbox-close {
            font-size: 2rem;
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </>
  );
}