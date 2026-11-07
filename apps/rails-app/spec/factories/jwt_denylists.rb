FactoryBot.define do
  factory :jwt_denylist do
    jti { "MyString" }
    exp { "2026-11-07 15:21:07" }
  end
end
