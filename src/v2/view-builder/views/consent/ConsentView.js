import { loc } from 'okta';

import BaseView from '../../internals/BaseView';
import BaseForm from '../../internals/BaseForm';
import ConsentViewHeader from './ConsentViewHeader';
import ConsentViewFooter from './ConsentViewFooter';

const Body = BaseForm.extend(
  {
    noButtonBar: false,
    noCancelButton: false,
    save: () => loc('consent.required.consentButton', 'login'),
    cancel: () => loc('consent.required.cancelButton', 'login'),
    title: false,
  },
);

export default BaseView.extend({
  Header: ConsentViewHeader,
  Body,
  initialize () {
    BaseView.prototype.initialize.apply(this, arguments);

    if (this.options.appState.get('currentFormName') === 'consent') {
      this.Footer = ConsentViewFooter;
    }
  },
  postRender () {
    // Move buttons in DOM to match visual hierarchy to fix tab order.
    // TODO https://oktainc.atlassian.net/browse/OKTA-350521
    const buttonContainer = this.$el.find('.o-form-button-bar');
    buttonContainer.find('.button-primary').appendTo(buttonContainer);

  },
  createModelClass (currentViewState) {
    const ModelClass = BaseView.prototype.createModelClass.apply(this, arguments);
    const scopes = currentViewState.uiSchema[0].options;

    return ModelClass.extend({
      props: {
        scopes: {type: 'array', value: scopes},
      },
      toJSON: function () {
        return {scopes: this.get('scopes').map(({name}) => name)};
      }
    });
  }
});