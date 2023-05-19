from django.shortcuts import render
from cloudinary.utils import cloudinary_url

def index(request):
    public_id = 'vexlzgoneltl2zanknfg'
    image_url, options = cloudinary_url(public_id)
    context = {'image_url': image_url}
    return render(request, 'index.html', context)