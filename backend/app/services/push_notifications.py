import logging

from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    PushServerError,
    PushTicketError,
)
import requests
from requests.exceptions import ConnectionError, HTTPError

from app.core.config import settings

logger = logging.getLogger(__name__)

# Optionally providing an access token within a session if you have enabled push security
session = requests.Session()
session.headers.update(
    {
        # "Authorization": f"Bearer {settings.EXPO_TOKEN}",  # TODO enhanced security
        "accept": "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
    }
)


# Basic arguments. You should extend this function with the push features you
# want to use, or simply pass in a `PushMessage` object.
def send_push_message(token, message, extra=None):
    try:
        response = PushClient(session=session).publish(
            PushMessage(to=token,
                        body=message,
                        data=extra))
    except PushServerError:
        logger.exception('Failed to send push notification')
        # Encountered some likely formatting/validation error
        raise
    except (ConnectionError, HTTPError) as exc:
        # Encountered some Connection or HTTP error - retry a few times in
        # case it is transient.
        logger.exception('Failed to send push notification - probably network error')
        raise

    try:
        # We got a response back, but we don't know whether it's an error yet.
        # This call raises errors so we can handle them with normal exception
        # flows.
        response.validate_response()
    except DeviceNotRegisteredError:
        # handle expired token
        logger.exception('Device not registered')
    except PushTicketError as exc:
        logger.exception('Failed to send push notification - some other error dunno')
