from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler for REST API
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        # Log the error
        logger.error(
            f"API Error: {exc.__class__.__name__} - {str(exc)}",
            exc_info=True,
            extra={
                'status_code': response.status_code,
                'view': context['view'].__class__.__name__,
            }
        )

        # Customize the error response
        custom_response_data = {
            'error': {
                'type': exc.__class__.__name__,
                'message': str(exc),
                'status_code': response.status_code,
            }
        }

        # Add validation errors if present
        if hasattr(exc, 'detail') and isinstance(exc.detail, dict):
            custom_response_data['error']['details'] = exc.detail

        response.data = custom_response_data

    return response
