# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_11_07_182945) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "jwt_denylists", force: :cascade do |t|
    t.string "jti", null: false
    t.datetime "exp", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["jti"], name: "index_jwt_denylists_on_jti"
  end

  create_table "odsl_execution_contexts", force: :cascade do |t|
    t.string "idempotency_key", null: false
    t.string "service_class", null: false
    t.string "method_name", null: false
    t.text "kwargs"
    t.string "status", default: "pending", null: false
    t.datetime "expires_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["expires_at"], name: "index_odsl_execution_contexts_on_expires_at"
    t.index ["idempotency_key"], name: "index_odsl_execution_contexts_on_idempotency_key", unique: true
  end

  create_table "odsl_step_records", force: :cascade do |t|
    t.bigint "execution_context_id", null: false
    t.string "name", null: false
    t.integer "step_index", null: false
    t.string "status", default: "pending", null: false
    t.text "result"
    t.text "error_message"
    t.boolean "non_resumable", default: false
    t.datetime "started_at"
    t.datetime "completed_at"
    t.index ["execution_context_id"], name: "index_odsl_step_records_on_execution_context_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "jti", default: "", null: false
    t.string "name", default: "", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "odsl_step_records", "odsl_execution_contexts", column: "execution_context_id"
end
