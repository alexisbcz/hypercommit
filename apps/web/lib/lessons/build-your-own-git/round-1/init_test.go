package main_test

import (
	"bytes"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

var binPath string

func TestMain(m *testing.M) {
	dir, err := os.MkdirTemp("", "mygit-bin-")
	if err != nil {
		panic(err)
	}
	binPath = filepath.Join(dir, "mygit")
	build := exec.Command("go", "build", "-o", binPath, ".")
	build.Stderr = os.Stderr
	if err := build.Run(); err != nil {
		panic(err)
	}
	code := m.Run()
	_ = os.RemoveAll(dir)
	os.Exit(code)
}

func TestInit_CreatesGitDirectory(t *testing.T) {
	dir := t.TempDir()
	var stdout, stderr bytes.Buffer
	cmd := exec.Command(binPath, "init")
	cmd.Dir = dir
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	if err := cmd.Run(); err != nil {
		t.Fatalf("mygit init failed: %v\nstdout: %s\nstderr: %s",
			err, stdout.String(), stderr.String())
	}
	info, err := os.Stat(filepath.Join(dir, ".git"))
	if err != nil {
		t.Fatalf(".git not created: %v", err)
	}
	if !info.IsDir() {
		t.Fatal(".git exists but is not a directory")
	}
}
