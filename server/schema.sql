CREATE TABLE users (
  user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(300) UNIQUE NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  user_role VARCHAR(30) NOT NULL DEFAULT 'standard',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  failed_pw_count INT NOT NULL DEFAULT 0,
  creation_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_updated_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_role CHECK (user_role IN ('standard', 'admin'))
);

CREATE TABLE categories (
  category_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_name VARCHAR(50) UNIQUE NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  creation_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_updated_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE assets (
  asset_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
  asset_name VARCHAR(50) NOT NULL,
  brand VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  serial_number VARCHAR(50) NOT NULL,
  purchase_date DATE NOT NULL,
  creation_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_updated_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE warranties (
  warranty_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  asset_id INT NOT NULL REFERENCES assets(asset_id) ON DELETE CASCADE,
  provider_name VARCHAR(50) NOT NULL,
  provider_phone VARCHAR(20),
  provider_email VARCHAR(50),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  warranty_description VARCHAR(300),
  --status VARCHAR(30) NOT NULL,
  creation_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_updated_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT dates_ordered CHECK (end_date > start_date),
  CONSTRAINT contact_provided CHECK (provider_phone IS NOT NULL OR provider_email IS NOT NULL)
);

CREATE TABLE documents (
  doc_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  asset_id INT NOT NULL REFERENCES assets(asset_id) ON DELETE CASCADE,
  file_name VARCHAR(300) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  doc_type VARCHAR(30) NOT NULL,
  creation_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_updated_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE error_logs (
  err_log_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
  error_message VARCHAR(500) NOT NULL,
  creation_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE maintenance_logs (
  maint_log_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  asset_id INT NOT NULL REFERENCES assets(asset_id) ON DELETE CASCADE,
  maint_date DATE NOT NULL,
  description VARCHAR(200) NOT NULL,
  maint_cost DECIMAL(10,2),
  creation_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_updated_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT cost_positive CHECK (maint_cost IS NULL OR maint_cost > 0)
);

CREATE INDEX idx_assets_user ON assets(user_id);
CREATE INDEX idx_assets_category ON assets(category_id);
CREATE INDEX idx_warranties_asset ON warranties(asset_id);
CREATE INDEX idx_documents_asset ON documents(asset_id);
CREATE INDEX idx_maintenance_asset ON maintenance_logs(asset_id);

INSERT INTO categories (category_name, is_default) 
VALUES ('Electronics', TRUE), ('Vehicles', TRUE), ('Appliances', TRUE),('Tools', TRUE), ('Furniture', TRUE);