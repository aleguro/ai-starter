module Auth
  # ODSL service object: the business logic behind user signup (ADR-01).
  class SignupService < Odsl::Dsl
    inmutable true

    def create
      with(:name, :email, :password).make(:build_user).get(:user)
      finish_with(:user)
    end

    private

    def build_user(name, email, password)
      User.new(name: name, email: email, password: password).tap(&:save)
    end
  end
end
