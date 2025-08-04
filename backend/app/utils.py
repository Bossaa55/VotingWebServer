import io
from typing import Optional
from PIL import Image

MAX_IMAGE_SIZE = (800, 600)
JPEG_QUALITY = 85

def optimize_image(image_data: bytes) -> Optional[bytes]:
    """Optimize image by resizing and compressing."""
    try:
        # Open image from bytes
        image = Image.open(io.BytesIO(image_data))

        # Convert to RGB if necessary (handles RGBA, P mode, etc.)
        if image.mode in ('RGBA', 'LA', 'P'):
            # Create white background
            background = Image.new('RGB', image.size, (255, 255, 255))
            if image.mode == 'P':
                image = image.convert('RGBA')
            background.paste(image, mask=image.split()[-1] if image.mode in ('RGBA', 'LA') else None)
            image = background
        elif image.mode != 'RGB':
            image = image.convert('RGB')

        # Resize if image is larger than max size
        image.thumbnail(MAX_IMAGE_SIZE, Image.Resampling.LANCZOS)

        # Save optimized image to bytes
        output = io.BytesIO()
        image.save(output, format='JPEG', quality=JPEG_QUALITY, optimize=True)
        return output.getvalue()

    except Exception as e:
        print(f"Error optimizing image: {e}")
        return None
