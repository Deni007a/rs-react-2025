import React from 'react';
import type { ChangeEvent } from 'react';

interface Props {
  onSearch: (term: string) => void;
  initialValue?: string;
}

interface State {
  input: string;
}

class SearchBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { input: props.initialValue ?? '' };
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: e.target.value });
  };

  handleSubmit = () => {
    const term = this.state.input.trim();
    if (term) this.props.onSearch(term);
  };

  render() {
    return (
      <div>
        <input value={this.state.input} onChange={this.handleChange} />
        <button onClick={this.handleSubmit}>Search</button>
      </div>
    );
  }
}

export default SearchBar;
