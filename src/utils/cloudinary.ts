// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
    cloudName: 'dd6hyrrdf',
    uploadPreset: 'my_shop_preset',
    uploadUrl: 'https://api.cloudinary.com/v1_1/dd6hyrrdf/image/upload'
};

/**
 * Upload a single file buffer to Cloudinary using unsigned upload preset
 */
export async function uploadToCloudinary(file: { buffer: Buffer; mimetype: string; originalname: string }): Promise<string> {
    // Generate a completely random public_id (alphanumeric only)
    const randomId = 'img' + Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
    
    // Create FormData for multipart upload
    const formData = new FormData();
    
    // Create Blob from buffer
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append('file', blob, randomId + '.jpg');
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('public_id', randomId);
    
    //console.log('Uploading to Cloudinary with public_id:', randomId);

    try {
        const response = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.text();
            console.log('Cloudinary error response:', error);
            throw new Error(`Cloudinary upload failed: ${error}`);
        }

        const result = await response.json();
        //console.log('Cloudinary upload success:', result.secure_url);
        return result.secure_url;
    } catch (error) {
        console.log('Upload error:', error);
        throw error;
    }
}

/**
 * Upload multiple files to Cloudinary
 */
export async function uploadMultipleToCloudinary(files: Array<{ buffer: Buffer; mimetype: string; originalname: string }>): Promise<string[]> {
    const uploadPromises = files.map(file => uploadToCloudinary(file));
    return Promise.all(uploadPromises);
}
