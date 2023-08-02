from django.contrib.auth.models import User
from profileapp.models import MemberProfile  


def global_variables(request):
    member_profile = None

    if request.user.is_authenticated:
        try:
            member_profile = MemberProfile.objects.get(user=request.user)
        except MemberProfile.DoesNotExist:
            pass

    return {
        'member_profile': member_profile,
    }