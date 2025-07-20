from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from .ragagent import main
import asyncio

# Create your views here.
async def index(request):

  agent_response = await main("hello")

  context = {
    'chat_output': agent_response
  }
  template = loader.get_template('index.html')
  return HttpResponse(template.render(context, request))
