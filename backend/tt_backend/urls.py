
# from django.contrib import admin
# from django.urls import path, include  
# from user import urls as user_urls
# from question import urls as question_urls
# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/', include('question_urls')), 
#     path('api/', include(user_urls)),
# ]


from django.contrib import admin
from django.urls import path, include

from user import urls as user_urls
from question import urls as question_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(user_urls)),
    path('api/questions/', include(question_urls)),  
]
