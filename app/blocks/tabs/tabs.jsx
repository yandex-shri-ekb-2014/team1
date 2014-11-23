/** @jsx React.DOM */
var React = require('react');
var normalizeurl = require('normalizeurl');
var urljoin = require('url-join');


var Tabs = React.createClass({
    itemClassName: function (name) {
        var result = 'tabs__item';

        if (name === 'short') { result += ' tabs__item_left'; }
        if (name === 'climate') { result += ' tabs__item_right'; }

        if (name === this.props.type) { result += ' tabs__item_active'; }

        return result;
    },

    itemHref: function (name) {
        var currentName = this.props.type;
        var currentURL = typeof document === 'undefined' ? this.props.documentURL : document.URL;

        if (currentName === name) { return currentURL; }

        function newURL(to) { return normalizeurl(urljoin(currentURL, to)); }

        if (name === 'short') {
            return newURL('..');
        }

        if (name === 'full') {
            if (currentName === 'short') { return newURL('details'); }
            if (currentName === 'climate') { return newURL('../details'); }
        }

        if (name === 'climate') {
            if (currentName === 'short') { return newURL('climate'); }
            if (currentName === 'full') { return newURL('../climate'); }
        }
    },

    render: function () {
        return (
            <div className="content__tabs">
                <ul className="tabs">
                    <li className={this.itemClassName('short')}>
                        <a href={this.itemHref('short')}  className="tabs__link">кратко</a>
                    </li>
                    <li className={this.itemClassName('full')}>
                        <a href={this.itemHref('full')}  className="tabs__link">подробно</a>
                    </li>
                    <li className={this.itemClassName('climate')}>
                        <a href={this.itemHref('climate')} className="tabs__link">наглядно</a>
                    </li>
                </ul>
            </div>
        );
    }
});


module.exports = Tabs;
