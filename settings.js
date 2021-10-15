export const settings = {
  id: 'test',
  button: {
    full: {
      icon: undefined,
      label: 'button 1',
      style: 'padding: 10px',
      advance: 'btn-classs-1',
    },
    small: {
      icon: undefined,
      label: 'button 1',
      style: 'padding: 10px',
      advance: 'btn-classs-2',
    },
  },
  general: {
    share: ['facebook'],
    notifyPopup: {
      style: {
        defaultId: 'xowl-popupp',
        custom: undefined,
      },
      content: {
        fail: 'FAIL ROI',
        success: 'SUCCESS ROI',
      },
      position: 'top',
    },
    maxItemAnonymous: 3,
  },
  wishlistPage: {
    buyNow: {
      label: 'buy nao',
      enable: true,
      style: 'padding: 20px',
    },
    display: {
      default: 'list',
      layoutChangeable: true,
    },
    addToCart: {
      enable: true,
      label: 'Add to cart label',
      actionAfter: 'cart',
      style: '',
    },
    itemStyleType: 'style',
  },
};
