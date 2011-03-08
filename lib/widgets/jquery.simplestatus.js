(function( $ ){

function SimpleStatus() {
    this._settings = {
        updateInterval: 30000,
        title: '',
        thresholds: {}
    };
}

$.extend(SimpleStatus.prototype, {
    init: function( target, settings ) {
        settings = $.extend( {}, this._settings, settings );

        var boxDiv = this._buildBox( target, settings.title );
        target.append(boxDiv);

        this._updateValue( boxDiv, settings );
    },

    _buildBox: function( target, title ) {
        var boxDiv = $('<div class="widget box-widget"></div>').append(
                $('<p class="header"></p>').text(title),
                $('<div class="body"></div>').append(
                  $('<p class="data"></p>')
                )
            );

        return boxDiv;
    },

    _updateValue: function( target, settings ) {
        var self = this;

        $.post(settings.url, function(data) {
            var dataDiv = target.find( '.data' );

            if ( dataDiv.text() != data || data === '0' ) {
                dataDiv.fadeOut( 500, function() {
                    self._updateDataClasses( self, dataDiv, data, settings.thresholds );

                    dataDiv.text( data );
                    dataDiv.fadeIn(500);
                });
            }

            setTimeout( function() {
                self._updateValue( target, settings );
            }, settings.updateInterval );
        });
    },

    _updateDataClasses: function( inst, dataDiv, value, thresholds ) {
        var oldClasses = inst._getKeysAsString( thresholds ),
            newClass = inst._findDataClass( value, thresholds );

        dataDiv.removeClass(oldClasses).addClass(newClass);
    },

    _findDataClass: function( value, thresholds ) {
        var foundClass = '';

        $.each( thresholds, function( idx, threshold ) {
          if ( value >= threshold[0] && (typeof threshold[1] === 'undefined' ||  value <= threshold[1] ) ) {
            foundClass = idx;

            return false;
          }
        });

        return foundClass;
    },

    _getKeysAsString: function(obj){
        var keys = '';

        for(var key in obj){
           keys += ' ' + key;
        }

        return keys;
    }
});

    $.fn.simplestatus = function( options ) {
        $.simplestatus.init( this, options );
    };

    $.simplestatus = new SimpleStatus();
})( jQuery );
