import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, FileVideo } from 'lucide-react';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';

function AdminUpload() {
  const { problemId } = useParams();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm();

  const selectedFile = watch('videoFile')?.[0];

  const onSubmit = async (data) => {
    const file = data.videoFile[0];

    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } =
        signatureResponse.data;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      const uploadResponse = await axios.post(upload_url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      const metadataResponse = await axiosClient.post('/video/save', {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset();
    } catch (err) {
      console.error('Upload error:', err);
      setError('root', {
        type: 'manual',
        message:
          err.response?.data?.message || 'Upload failed. Please try again.',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[var(--cc-bg-primary)]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <NavLink
          to="/admin/video"
          className="inline-flex items-center gap-2 text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Videos</span>
        </NavLink>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[var(--cc-text-primary)] mb-2">
            Upload Video
          </h1>
          <p className="text-[var(--cc-text-secondary)]">
            Upload a video solution for this problem
          </p>
        </div>

        <div className="cc-card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* File Input */}
            <div>
              <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-2">
                Choose video file
              </label>
              <label
                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  errors.videoFile
                    ? 'border-[var(--cc-error)] bg-[rgba(239,68,68,0.05)]'
                    : 'border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] bg-[var(--cc-bg-input)]'
                }`}
              >
                <div className="flex flex-col items-center gap-2 py-6">
                  <FileVideo
                    size={32}
                    className="text-[var(--cc-text-dimmed)]"
                  />
                  <p className="text-sm text-[var(--cc-text-muted)]">
                    Click to select a video file
                  </p>
                  <p className="text-xs text-[var(--cc-text-dimmed)]">
                    Max 100MB &middot; Video formats only
                  </p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  {...register('videoFile', {
                    required: 'Please select a video file',
                    validate: {
                      isVideo: (files) => {
                        if (!files || !files[0])
                          return 'Please select a video file';
                        const file = files[0];
                        return (
                          file.type.startsWith('video/') ||
                          'Please select a valid video file'
                        );
                      },
                      fileSize: (files) => {
                        if (!files || !files[0]) return true;
                        const file = files[0];
                        const maxSize = 100 * 1024 * 1024;
                        return (
                          file.size <= maxSize ||
                          'File size must be less than 100MB'
                        );
                      },
                    },
                  })}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {errors.videoFile && (
                <p className="mt-1.5 text-sm text-[var(--cc-error)]">
                  {errors.videoFile.message}
                </p>
              )}
            </div>

            {/* Selected File Info */}
            {selectedFile && (
              <div className="flex items-center gap-3 bg-[rgba(99,102,241,0.08)] border border-[rgba(99,102,241,0.2)] rounded-xl px-4 py-3">
                <FileVideo
                  size={20}
                  className="text-[var(--cc-primary-light)] shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--cc-text-primary)] truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-[var(--cc-text-muted)]">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--cc-text-secondary)]">
                    Uploading...
                  </span>
                  <span className="text-[var(--cc-primary-light)] font-medium">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[var(--cc-bg-secondary)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--cc-primary)] to-[var(--cc-primary-light)] rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.root && (
              <div className="flex items-center gap-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] rounded-xl px-4 py-3">
                <AlertCircle
                  size={18}
                  className="text-[var(--cc-error)] shrink-0"
                />
                <p className="text-sm text-[#f87171]">
                  {errors.root.message}
                </p>
              </div>
            )}

            {/* Success Message */}
            {uploadedVideo && (
              <div className="flex items-start gap-3 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] rounded-xl px-4 py-3">
                <CheckCircle
                  size={18}
                  className="text-[var(--cc-success)] shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-[#34d399]">
                    Upload Successful!
                  </p>
                  <p className="text-xs text-[var(--cc-text-muted)] mt-1">
                    Duration: {formatDuration(uploadedVideo.duration)}
                  </p>
                  <p className="text-xs text-[var(--cc-text-muted)]">
                    Uploaded:{' '}
                    {new Date(uploadedVideo.uploadedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              type="submit"
              disabled={uploading}
              className="cc-btn-primary w-full text-base py-3 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Video
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminUpload;
