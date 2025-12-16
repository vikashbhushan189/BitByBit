from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

class SingleDeviceJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        # 1. Get the user object using standard logic
        user = super().get_user(validated_token)
        
        # 2. Check for token_version claim
        token_version = validated_token.get('token_version')
        
        # 3. Compare with DB version
        # If the token's version is older than the user's current version, reject it.
        if token_version is not None and user.token_version != token_version:
            raise AuthenticationFailed('You have logged in on another device. Please login again.')
            
        return user