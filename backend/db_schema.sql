-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS marks;
DROP TABLE IF EXISTS group_members;
DROP TABLE IF EXISTS project_groups;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS supervisors;

-- Create supervisors table
CREATE TABLE supervisors (
    emp_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- Create students table
CREATE TABLE students (
    reg_no VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cgpa NUMERIC(4, 2) NOT NULL
);

-- Create project_groups table
CREATE TABLE project_groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL,
    assigned_supervisor_id VARCHAR(50),
    FOREIGN KEY (assigned_supervisor_id) REFERENCES supervisors(emp_id) ON DELETE SET NULL
);

-- Create group_members junction table
CREATE TABLE group_members (
    group_id INT NOT NULL,
    student_reg_no VARCHAR(50) NOT NULL UNIQUE, -- UNIQUE constraint prevents a student from being in multiple groups
    PRIMARY KEY (group_id, student_reg_no),
    FOREIGN KEY (group_id) REFERENCES project_groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (student_reg_no) REFERENCES students(reg_no) ON DELETE CASCADE
);

-- Create marks table
CREATE TABLE marks (
    mark_id SERIAL PRIMARY KEY,
    student_reg_no VARCHAR(50) NOT NULL,
    group_id INT NOT NULL,
    review1_marks INT DEFAULT 0,
    review2_marks INT DEFAULT 0,
    review3_marks INT DEFAULT 0,
    review4_marks INT DEFAULT 0,
    FOREIGN KEY (student_reg_no) REFERENCES students(reg_no) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES project_groups(group_id) ON DELETE CASCADE
);

