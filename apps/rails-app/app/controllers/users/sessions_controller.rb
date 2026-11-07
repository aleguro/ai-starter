module Users
  class SessionsController < Devise::SessionsController
    skip_before_action :verify_signed_out_user, raise: false

    def create
      user, = Auth::LoginService.new(
        email: params.dig(:user, :email),
        password: params.dig(:user, :password)
      ).run(:authenticate)

      if user
        # store: false, see Users::RegistrationsController#create for why.
        sign_in(user, store: false)
        render json: { id: user.id, email: user.email, name: user.name }, status: :ok
      else
        render json: { errors: [ "Invalid email or password" ] }, status: :unauthorized
      end
    end

    def destroy
      # Token revocation itself is handled by Warden::JWTAuth's revocation
      # middleware (matches DELETE /logout, see config/initializers/devise.rb)
      # regardless of what this action does.
      head :no_content
    end
  end
end
