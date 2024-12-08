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

ActiveRecord::Schema[7.2].define(version: 2024_12_07_205258) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "benefits_discounts", force: :cascade do |t|
    t.string "title"
    t.string "location"
    t.date "start_date"
    t.date "end_date"
    t.text "offer_description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "link"
    t.boolean "is_saved", default: false, null: false
    t.string "business_type"
  end

  create_table "discounts", force: :cascade do |t|
    t.string "title"
    t.string "location"
    t.boolean "is_saved"
    t.string "offer_description"
    t.string "redeem_desc"
    t.date "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "eventlists", force: :cascade do |t|
    t.string "eventType"
    t.date "startDate"
    t.date "endDate"
    t.string "location"
    t.string "org"
    t.time "timeStart"
    t.time "timeEnd"
    t.string "eventName"
    t.boolean "isSaved"
    t.text "eventDesc"
    t.text "instruct"
    t.string "pic"
    t.string "phone"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "get_involveds", force: :cascade do |t|
    t.string "title"
    t.text "summary"
    t.text "description"
    t.date "date"
    t.string "time"
    t.string "location"
    t.string "phone"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "jobs", force: :cascade do |t|
    t.string "title"
    t.string "company"
    t.text "description"
    t.text "responsibilities"
    t.text "requirements"
    t.string "salary"
    t.string "contact"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "members", id: :serial, force: :cascade do |t|
    t.string "name", limit: 100, null: false
    t.string "email", limit: 100, null: false
    t.date "join_date", default: -> { "CURRENT_DATE" }

    t.unique_constraint ["email"], name: "members_email_key"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
end
