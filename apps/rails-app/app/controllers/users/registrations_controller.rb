module Users
  class RegistrationsController < Devise::RegistrationsController
    skip_before_action :authenticate_scope!, raise: false

    def create
      user, = Auth::SignupService.new(
        name: params.dig(:user, :name),
        email: params.dig(:user, :email),
        password: params.dig(:user, :password)
      ).run(:create)

      if user.persisted?
        # store: false — auth is stateless JWT; a stored Warden session would
        # let requests authenticate via the session cookie and silently
        # bypass JWT revocation (see devise-jwt's README "Security" section).
        sign_in(user, store: false)
        render json: { id: user.id, email: user.email, name: user.name }, status: :created
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_content
      end
    end
  end
end
