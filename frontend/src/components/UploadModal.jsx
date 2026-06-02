import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Sparkles, Image, Compass, RefreshCw, Cpu } from 'lucide-react';
import api from '../services/api';
import styles from './UploadModal.module.css';

const AI_STATUS_STEPS = [
  'Uploading image safely to storage...',
  'Initializing Google Gemini AI agent...',
  'Scanning image subject and context...',
  'Detecting lighting, emotion, and setting...',
  'Formulating creative wordplay...',
  'Selecting relevant hashtags and emojis...',
  'Finalizing post details...'
];

const UploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiStatusIdx, setAiStatusIdx] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  // Cycle through AI Status Messages during generation
  useEffect(() => {
    let interval;
    if (isGenerating) {
      setAiStatusIdx(0);
      interval = setInterval(() => {
        setAiStatusIdx((prev) => (prev + 1) % AI_STATUS_STEPS.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setErrorMsg('');

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    setErrorMsg('');
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds the limit of 10MB.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview('');
    setErrorMsg('');
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleGeneratePost = async () => {
    if (!selectedFile) return;

    setIsGenerating(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await api.post('/api/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        onSuccess();
        onClose();
        handleReset();
      }
    } catch (err) {
      console.error('Error generating post:', err);
      const msg = err.response?.data?.message || 'Failed to create post. Please try again.';
      setErrorMsg(msg);
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} glass-panel`}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Sparkles className="text-gradient-neon" size={20} />
            <span className="text-gradient-neon">Generate Post</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} disabled={isGenerating}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.content}>
          {errorMsg && (
            <div className="glass-panel" style={{
              background: 'rgba(244, 63, 94, 0.1)',
              borderColor: 'rgba(244, 63, 94, 0.2)',
              color: 'var(--error)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              marginBottom: '1rem'
            }}>
              {errorMsg}
            </div>
          )}

          {isGenerating ? (
            /* Holographic AI Loading State */
            <div className={styles.aiLoadingScreen}>
              <div className={styles.aiBrainContainer}>
                <div className={styles.hologramRing}></div>
                <div className={styles.hologramRingInner}></div>
                <Cpu className={styles.aiBrain} size={40} />
              </div>
              <div>
                <h3 className={`${styles.aiStatusTitle} text-gradient`}>Crafting AI Magic...</h3>
                <p className={styles.aiStatusMsg}>{AI_STATUS_STEPS[aiStatusIdx]}</p>
              </div>
            </div>
          ) : !imagePreview ? (
            /* Upload Prompt State */
            <div
              className={`${styles.dropZone} ${dragOver ? styles.dropZoneHover : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <input
                type="file"
                ref={fileInputRef}
                className={styles.fileInput}
                onChange={handleFileSelect}
                accept="image/*"
              />
              <Upload className={styles.uploadIcon} size={32} />
              <div className={styles.uploadText}>Drag & drop an image here</div>
              <div className={styles.uploadSubtext}>or click to search computer files (Max 10MB)</div>
            </div>
          ) : (
            /* Preview State */
            <div className={styles.previewContainer}>
              <div className={styles.previewWrapper}>
                <img src={imagePreview} alt="Preview" className={styles.previewImage} />
              </div>
              <div className={styles.actionBtns}>
                <button
                  className={styles.actionBtnSecondary}
                  onClick={handleReset}
                >
                  Change Image
                </button>
                <button
                  className={styles.actionBtnPrimary}
                  onClick={handleGeneratePost}
                >
                  <Sparkles size={16} />
                  <span>Generate AI Caption</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
