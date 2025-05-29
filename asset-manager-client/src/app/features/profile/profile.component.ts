  loadUserAssets(): void {
    this.loading = true;
    this.error = null;

    this.assetService.getUserAssets().subscribe({
      next: (assets) => {
        this.userAssets = assets;
        this.loading = false;
      },
      error: () => {
        // Don't show error message since the service now returns empty array on error
        this.loading = false;
        this.userAssets = [];
      }
    });
  }