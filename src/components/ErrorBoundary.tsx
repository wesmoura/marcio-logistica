import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error("UI error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-sm text-destructive bg-background">
          Ocorreu um erro na interface. Atualize a página.
          {this.state.message && (
            <pre className="mt-2 whitespace-pre-wrap text-muted-foreground">{this.state.message}</pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}


