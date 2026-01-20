import multer from 'multer';

// Use memory storage for Cloudinary uploads (files are uploaded directly to cloud)
const storage = multer.memoryStorage();

const fileFilter = (_req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed'), false);
    }
};

// Cloudinary upload middleware (stores in memory)
export const cloudinaryUpload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

// Legacy disk storage (kept for backward compatibility if needed)
const diskStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads/products');
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + require('path').extname(file.originalname));
    }
});

export const upload = multer({
    storage: diskStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});
