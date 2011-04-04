(function(jQuery, undefined) {
    jQuery.widget('Midgard.midgardStorage', {
        options: {
            localStorage: false,
            changedModels: []
        },
    
        _create: function() {
            var widget = this;
            
            if (Modernizr.localstorage) {
                this.options.localStorage = true;
            }

            VIE.EntityManager.initializeCollection();
            VIE.EntityManager.entities.bind('add', function(model) {
                widget._prepareEntity(model);
            });
            
            jQuery('#midgardcreate-save').click(function() {
                widget._saveRemote({
                    success: function() {
                        jQuery('#midgardcreate-save').button({disabled: true});
                    },
                    error: function() {
                        console.log("Save failed");
                    }
                });
            });
            
            widget._bindEditables();
        },
        
        _bindEditables: function() {
            var widget = this;

            widget.element.bind('editablechanged', function(event, options) {
                if (_.indexOf(widget.options.changedModels, options.instance) === -1) {
                    widget.options.changedModels.push(options.instance);
                }
                widget._saveLocal(options.instance);
                jQuery('#midgardcreate-save').button({disabled: false});
            });
            
            widget.element.bind('editabledisable', function(event, options) {
                widget._restoreLocal(options.instance);
                jQuery('#midgardcreate-save').button({disabled: true});
            });
            
            widget.element.bind('editableenable', function(event, options) {
                widget._readLocal(options.instance);
                _.each(options.instance.attributes, function(attributeValue, property) {
                    if (attributeValue instanceof VIE.RDFEntityCollection) {
                        //widget._readLocalReferences(options.instance, property, attributeValue);
                    }
                });
            });
        },
        
        _prepareEntity: function(model) {
            var widget = this;
            
            // Add the Midgard-specific save URL used by Backbone.sync
            model.url = '/mgd:create/object/';
            model.toJSON = model.toJSONLD;
            
            // Regular change event from VIE
            model.bind('storage:loaded', function(model) {
                if (_.indexOf(widget.options.changedModels, model) === -1) {
                    widget.options.changedModels.push(model);
                }
                jQuery('#midgardcreate-save').button({disabled: false});
            });
        },
        
        _saveRemote: function(options) {
            var widget = this;
            var needed = widget.options.changedModels.length;
            _.forEach(widget.options.changedModels, function(model, index) {
                model.save(null, {
                    success: function() {
                        if (model.originalAttributes) {
                            // From now on we're going with the values we have on server
                            delete model.originalAttributes;
                        }
                        widget._removeLocal(model);
                        delete widget.options.changedModels[index];
                        needed--;
                        if (needed <= 0) {
                            // All models were happily saved
                            options.success();
                        }
                    },
                    error: function() {
                        options.error();
                    }
                });
            });
        },

        _saveLocal: function(model) {
            if (!this.options.localStorage) {
                return;
            }

            if (typeof model.id === 'object') {
                // Anonymous object, save as refs instead
                if (!model.primaryCollection) {
                    return;
                }
                return this._saveLocalReferences(model.primaryCollection.subject, model.primaryCollection.predicate, model);
            }
            
            localStorage.setItem(model.getSubject(), JSON.stringify(model.toJSONLD()));
        },
        
        _getReferenceId: function(model, property) {
            return model.id + ':' + property;
        },
        
        _saveLocalReferences: function(subject, predicate, model) {
            if (!this.options.localStorage) {
                return;
            }
            
            if (!subject ||
                !predicate) {
                return;
            }
            
            var widget = this;
            var identifier = subject + ':' + predicate;
            var json = model.toJSONLD();
            if (localStorage.getItem(identifier)) {
                var referenceList = JSON.parse(localStorage.getItem(identifier));
                var index = _.pluck(referenceList, '@').indexOf(json['@']);
                if (index !== -1) {
                    referenceList[index] = json;
                } else {
                    referenceList.push(json);
                }
                localStorage.setItem(identifier, JSON.stringify(referenceList));
                return;
            }
            localStorage.setItem(identifier, JSON.stringify([json]));
        },

        _readLocal: function(model) {
            if (!this.options.localStorage) {
                return;
            }
            
            var local = localStorage.getItem(model.getSubject());
            if (!local) {
                return;
            }
            model.originalAttributes = _.clone(model.attributes);
            var entity = VIE.EntityManager.getByJSONLD(JSON.parse(local));
            model.trigger('storage:loaded', model);
        },
        
        _readLocalReferences: function(model, property, collection) {
            if (!this.options.localStorage) {
                return;
            }
            
            var identifier = this._getReferenceId(model, property);
            var local = localStorage.getItem(identifier);
            if (!local) {
                return;
            }
            collection.add(JSON.parse(local));
        },
        
        _restoreLocal: function(model) {
            // Remove unsaved collection members
            _.each(model.attributes, function(attributeValue, property) {
                if (attributeValue instanceof VIE.RDFEntityCollection) {
                    attributeValue.forEach(function(model) {
                        if (typeof model.id === 'object') {
                            attributeValue.remove(model);
                        }
                    });
                }
            });
            
            // Restore original object properties
            if (jQuery.isEmptyObject(model.changedAttributes())) {
                if (model.originalAttributes) {
                    model.set(model.originalAttributes);
                    delete model.originalAttributes;
                }
                return;
            }
            model.set(model.previousAttributes());
        },
        
        _removeLocal: function(model) {
            if (!this.options.localStorage) {
                return;
            }
            
            localStorage.removeItem(model.getSubject());
        }
    })
})(jQuery);
