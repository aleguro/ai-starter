class User < ApplicationRecord
  # API-only + stateless JWT auth: no cookie session (:rememberable) or
  # mailer-based recovery flow — out of this feature's spec scope.
  devise :database_authenticatable, :registerable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  validates :name, presence: true
end
