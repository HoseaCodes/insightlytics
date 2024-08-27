"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import InstagramLogin from '@/components/instagram-login';

export default function InstagramPostPage() {
    const [igLoggedIn, setIgLoggedIn] = useState(true);
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState(null); // State to handle file inputs
    const [uploading, setUploading] = useState(false); // State for upload status
    const [posting, setPosting] = useState(false); // State for posting status
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState(null); // URL of the uploaded file

    // Validate file based on Instagram Reels specifications
    const validateFile = (file) => {
        const maxFileSize = 100 * 1024 * 1024; // 100 MB
        const allowedTypes = ['video/mp4', 'video/quicktime'];

        if (file.size > maxFileSize) {
            return 'File size exceeds 100 MB limit.';
        }
        if (!allowedTypes.includes(file.type)) {
            return 'Invalid file type. Only MP4 and QuickTime files are allowed.';
        }
        return null;
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const validationError = validateFile(selectedFile);
            if (validationError) {
                setError(validationError);
                setFile(null);
            } else {
                setFile(selectedFile);
                setError(null);
            }
        }
    };

    const handleFileUpload = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Error: ${res.status} ${res.statusText}`);
            }

            setUploadedFileUrl(data); // Save the uploaded file URL
            setSuccess('File uploaded successfully!');
        } catch (err) {
            setError(`Failed to upload file: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleInstagramPost = async () => {
        if (!uploadedFileUrl) {
            setError('Please upload a file first.');
            return;
        }

        setPosting(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch('/api/instagram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    caption,
                    videoUrl: uploadedFileUrl, // Use the URL of the uploaded file
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Error: ${res.status} ${res.statusText}`);
            }

            setSuccess('Post published successfully!');
            setCaption('');
            setFile(null);
            setUploadedFileUrl(null);
        } catch (err) {
            setError(`Failed to publish post: ${err.message}`);
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            {!igLoggedIn ? (
                <InstagramLogin />
            ) : (
                <>
                    <h2 className="text-2xl font-semibold mb-4">Create Instagram Post</h2>
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                        <div>
                            <label htmlFor="file" className="block text-sm font-medium mb-2">Upload Video</label>
                            <Input
                                id="file"
                                type="file"
                                accept="video/mp4,video/quicktime"
                                onChange={handleFileChange}
                                className="w-full"
                            />
                        </div>
                        <Button
                            onClick={handleFileUpload}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            disabled={uploading || !file}
                        >
                            {uploading ? 'Uploading...' : 'Upload Video'}
                        </Button>
                        <div>
                            <label htmlFor="caption" className="block text-sm font-medium mb-2">Caption</label>
                            <Textarea
                                id="caption"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Enter caption"
                                className="w-full"
                                rows="4"
                            />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        {success && <p className="text-green-500">{success}</p>}
                        <Button
                            onClick={handleInstagramPost}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            disabled={posting || !uploadedFileUrl}
                        >
                            {posting ? 'Posting...' : 'Post to Instagram'}
                        </Button>
                    </form>
                </>
            )}
        </div>
    );
}
