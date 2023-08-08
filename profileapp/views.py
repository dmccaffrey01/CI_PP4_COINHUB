from django.shortcuts import render, redirect, get_object_or_404
from .models import MemberProfile
from .forms import MemberProfileForm, MemberProfilePictureForm
import base64
from django.core.files.base import ContentFile
import cloudinary.uploader


def profile(request):
    user = request.user

    member_profile, created = MemberProfile.objects.get_or_create(user=user)

    member_profile.save()

    context = {
        'user': user,
        'member_profile': member_profile,
    }

    return render(request, 'profile.html', context)


def edit_profile(request):
    user = request.user
    
    member_profile = get_object_or_404(MemberProfile, user=user)

    if request.method == 'POST':
        if 'cancel' in request.POST:
            return redirect('profileapp:profile')
        form = MemberProfileForm(request.POST, instance=member_profile)
        if form.is_valid():
            form.save()
            return redirect('profileapp:profile')
    else:
        form = MemberProfileForm(instance=member_profile)
    
    context = {
        'user': user,
        'form': form,
        'member_profile': member_profile,
        'edit_profile': True,
    }

    return render(request, 'profile.html', context)


def edit_profile_picture(request):
    user = request.user

    member_profile = get_object_or_404(MemberProfile, user=user)

    if request.method == 'POST':
        if 'cancel' in request.POST:
            return redirect('profileapp:profile')
        form = MemberProfilePictureForm(request.POST, instance=member_profile)
        if form.is_valid():
            form.save()
            cropped_image_data = request.POST.get('croppedImageData')
            if cropped_image_data.startswith('https://res.cloudinary.com'):
                return redirect('profileapp:profile')
            else:
                if cropped_image_data:
                    # Decode the Base64 image data
                    image_data = base64.b64decode(cropped_image_data.split(',')[-1])

                    image_file = ContentFile(image_data)

                    # Upload the image file to Cloudinary
                    cloudinary_response = cloudinary.uploader.upload(image_file, public_id="profile_image")

                    # Save the Cloudinary image URL in the profile_image field of the MemberProfile model
                    member_profile = MemberProfile.objects.get(user=request.user)
                    member_profile.profile_image = cloudinary_response['secure_url']
                    member_profile.save()
                    return redirect('profileapp:profile')
    else:
        form = MemberProfilePictureForm(instance=member_profile)

    context = {
        'user': user,
        'form': form,
        'member_profile': member_profile,
        'edit_profile': True,
        'edit_profile_picture': True,
    }

    return render(request, 'profile.html', context)

