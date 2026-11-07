module Auth
  # ODSL service object: credential verification for login (ADR-01).
  # Reuses Devise's own bcrypt comparison (User#valid_password?) rather
  # than reinventing password matching.
  class LoginService < Odsl::Dsl
    inmutable true

    def authenticate
      with(:email, :password).make(:find_authenticated_user).get(:user)
      finish_with(:user)
    end

    private

    def find_authenticated_user(email, password)
      user = User.find_by(email: email)
      user&.valid_password?(password) ? user : nil
    end
  end
end
