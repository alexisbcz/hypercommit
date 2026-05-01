package main

import (
	"context"
	"fmt"
	"os"

	"github.com/urfave/cli/v3"
)

func main() {
	cmd := &cli.Command{
		Name:  "mygit",
		Usage: "a tiny Git",
		Commands: []*cli.Command{
			{
				Name:  "init",
				Usage: "create an empty Git repository",
				Action: func(ctx context.Context, cmd *cli.Command) error {
					// TODO: create a directory called ".git" in the current working directory.
					// Hint: os.MkdirAll(".git", 0o755)
					return nil
				},
			},
		},
	}
	if err := cmd.Run(context.Background(), os.Args); err != nil {
		fmt.Fprintln(os.Stderr, "fatal:", err)
		os.Exit(1)
	}
}
