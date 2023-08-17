import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { CommonProps } from '../../types';
import { errorLog } from '../../utils';
import Panel from './Panel';

export interface BoundaryProps extends CommonProps {
	name: string;
}

interface State {
	error?: Error;
}

export class Boundary extends Component<BoundaryProps, State> {
	public static override whyDidYouRender = true;
	public static displayName: string = 'ErrorBoundary';

	public constructor(props: BoundaryProps) {
		super(props);
		this.state = {};
	}

	public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		const { name } = this.props;

		this.setState({ error });
		errorLog(name, error, errorInfo);
	}

	public override render(): ReactNode {
		const { error } = this.state;
		const { children } = this.props;

		if (error) {
			return <Panel error={error} />;
		}

		return children;
	}

	public static getDerivedStateFromError(error: Error): State {
		return { error };
	}
}

export default Boundary;
