import { render, unmountComponentAtNode } from 'react-dom';
import { Scenarios } from '../capabilities/scenarios';
export class AgoraOnlineClassSDK {
  static launch(dom: HTMLElement) {
    render(<Scenarios></Scenarios>, dom);
    return () => unmountComponentAtNode(dom);
  }
}
