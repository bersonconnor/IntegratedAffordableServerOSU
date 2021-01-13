import React from 'react';

import ReactDOM from 'react-dom';

import DropzoneComponent from 'react-dropzone-component';

import ReactDOMServer from 'react-dom/server'

export default class Example extends React.Component {

    constructor(props) {
        super(props);

        this.componentConfig = {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl: 'http://localhost:3020/files',
            dropzoneSelector: '.manager',
        };

        // If you want to attach multiple callbacks, simply
        // create an array filled with all your callbacks.
        this.callbackArray = [() => console.log('Hi!'), () => console.log('Ho!')];
        // Simple callbacks work too, of course
        this.callback = () => console.log('Hello!');
        this.success = file => console.log('uploaded', file);
        this.removedfile = file => console.log('removing...', file);
        this.dropzone = null;
	console.log("DROPZONE CONSTRUCTED");
    }

    //dropUI() {
      //document.getElementById("filemanager-1").className = 'overlayUI';
    //}

    render() {
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;
        // For a list of all possible events (there are many), see README.md!
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            drop: this.props.onDrop,
            addedfile: this.callback,
            success: this.success,
            removedfile: this.removedfile,
            dragenter: this.props.onDrag,
            dragleave: this.props.onDragExit
        }
	console.log("DROPZONE RENDERED");
        return <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={this.props.djsConfig} />
	
    }

}
