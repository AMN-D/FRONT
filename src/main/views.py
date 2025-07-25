from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from .ragagent import main
import asyncio

# Create your views here.
@csrf_exempt
async def index(request):
    chat_output = ""
    
    if request.method == "POST":
        user_input = request.POST.get("user_input", "")
        if user_input:
            chat_output = await main(user_input)

    template = loader.get_template('index.html')
    context = {
        'chat_output': chat_output
    }
    return HttpResponse(template.render(context, request))