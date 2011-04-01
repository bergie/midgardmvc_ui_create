(function(jQuery, undefined) {
    jQuery.widget('Midgard.midgardCreate', {
        options: {
            toolbar: 'full',
            saveButton: null,
            state: 'browse',
            highlightColor: '#67cc08'
        },
    
        _create: function() {
            this._checkSession();
            this._enableToolbar();
            this._saveButton();
            this._editButton();
        },
        
        _init: function() {
            if (this.options.state === 'edit') {
                this._enableEdit();
            } else {
                this._disableEdit();
            }
        },
        
        _checkSession: function() {
            if (!Modernizr.sessionstorage) {
                return;
            }
            
            if (sessionStorage.getItem('Midgard.create.toolbar')) {
                this._setOption('toolbar', sessionStorage.getItem('Midgard.create.toolbar'));
            }
            
            if (sessionStorage.getItem('Midgard.create.state')) {
                this._setOption('state', sessionStorage.getItem('Midgard.create.state'));
            }
        },
        
        _saveButton: function() {
            if (this.options.saveButton) {
                return this.options.saveButton;
            }
            
            jQuery('#midgard-bar .toolbarcontent-right').append(jQuery('<button id="midgardcreate-save">Save</button>'));
            this.options.saveButton = jQuery('#midgardcreate-save');
            this.options.saveButton.button({disabled: true})
            return this.options.saveButton;
        },
        
        _editButton: function() {
            var widget = this;
            jQuery('#midgard-bar .toolbarcontent-right').append(jQuery('<input type="checkbox" id="midgardcreate-edit" /><label for="midgardcreate-edit">Edit</label>'));
            var editButton = jQuery('#midgardcreate-edit').button();
            if (this.options.state === 'edit') {
                editButton.attr('checked', true);
                editButton.button('refresh');
            }
            editButton.bind('change', function() {
                if (editButton.attr('checked')) {
                    widget._enableEdit();
                    return;
                }
                widget._disableEdit();
            });
        },
        
        _enableToolbar: function() {
            var widget = this;
            this.element.bind('toolbarstatechange', function(event, options) {
                if (Modernizr.sessionstorage) {
                    sessionStorage.setItem('Midgard.create.toolbar', options.display);
                }
                widget._setOption('toolbar', options.display);
            });

            this.element.toolbar({display: this.options.toolbar});
        },
        
        _enableEdit: function() {
            var widget = this;
            jQuery('[about]').each(function() {
                var subject = VIE.RDFa.getSubject(this);
                var loadedLocal = false;
                                
                jQuery(this).bind('editableenable', function(event, options) {
                    if (VIE.RDFa.getSubject(options.element) !== subject) {
                        // Propagated event from another entity, ignore
                        return;
                    }
                    
                    // Highlight the editable
                    options.element.effect('highlight', {color: widget.options.highlightColor}, 3000);
                });

                jQuery(this).editable({disabled: false});
            });
            if (Modernizr.sessionstorage) {
                sessionStorage.setItem('Midgard.create.state', 'edit');
            }
            this._setOption('state', 'edit');
        },
        
        _disableEdit: function() {
            jQuery('[about]').each(function() {
                jQuery(this).editable({disabled: true}).removeClass('ui-state-disabled');
            });
            if (Modernizr.sessionstorage) {
                sessionStorage.setItem('Midgard.create.state', 'browse');
            }
            this._setOption('state', 'browse');
        }
    })
})(jQuery);
