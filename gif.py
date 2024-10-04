from PIL import Image
import os

# Specify the directory containing your images
image_folder = '/images'

# Create a list of file paths for images (image_0.png to image_30.png)
images = [Image.open(os.path.join(image_folder, f"segmented_image_{i}.png")) for i in range(31)]

# Save the images as a GIF
gif_path = os.path.join(image_folder, 'output.gif')
images[0].save(gif_path, save_all=True, append_images=images[1:], duration=200, loop=0)

print(f"GIF saved at {gif_path}")
