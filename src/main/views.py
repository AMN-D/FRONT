from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .ragagent import main
import asyncio

# Create your views here.
class ChatAPIView(APIView):
    def post(self, request):
        user_input = request.data.get("user_input", "")
        if not user_input:
            return Response({"error": "user_input is required"}, status=status.HTTP_400_BAD_REQUEST)

        chat_output = asyncio.run(main(user_input))
        return Response({"chat_output": chat_output}, status=status.HTTP_200_OK)
