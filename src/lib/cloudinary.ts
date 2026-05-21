import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (file:Blob):Promise<string | null> => {
if(!file) {
    return null
}

try {
    const arrayBuffer = file.arrayBuffer()
} catch (error) {
    
}
}