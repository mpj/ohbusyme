define(['/viewmodels/overview.js'], function(OverviewModel) {
describe('Parsing entire OverviewModel', function() {
  
  var options;
  var overview;
  var error;
  var events;
  beforeEach(function() {
    options = undefined;
    overview = undefined;
    error = undefined;
    events = []
  })

  var fakeEventBus = {
    dispatch: function(type, id) {
      events.push({ type: type, id: id})
    } 
  }

  var parseResult = function(fn) {
    describe('after parsing for result', function() {
      beforeEach(function() {
        overview = new OverviewModel(options, fakeEventBus)
      })
      fn()
    })
  }

  var parseError = function(fn) {
    describe('after parsing for error', function() {
      beforeEach(function() {
        try       { new OverviewModel(options, fakeEventBus) } 
        catch(e)  { error = e }
      })
      fn()
    })
  }

  describe('Basic parsing errors', function() {
    describe('undefined provided', function() {
      parseError(function() {
        it('should complain', function() {
          error.message.should.equal('Argument options was not provided.')
        })
      })
    })
    describe('No properties provided', function() {
      beforeEach(function() {
        options = {}
      })
      parseError(function() {
        it('complains about days', function() {
          error.message.should.equal('Property days was not provided.')
        })
      })      
    })
  })


  describe('Given that a minimal structure is defined', function() {
    
    var person;
    beforeEach(function() {
      options = {
        days: [{
          label: 'Tomorrow',
          segments: {
            daytime: {
              label: 'Daytime',
              persons: []
            },
            evening: {
              label: 'Evening',
              persons: [{
                id: 'person987',
                imageSrc: 'image.png',
                look: 'free',
                label: '*Fredrik* is **free** during *daytime* this *Monday*'
              }]
            }
          }
        }]
      }
    })

    describe('day parsing', function() {

      parseResult(function() {
        it('parses label', function() {
          overview.days()[0].label()   .should.equal("Tomorrow")
        })
      })

      describe('label missing', function() {
        beforeEach(function() {
          delete options.days[0].label
        })

        parseError(function() {
          it('complains about label', function() {
            error.message.should.equal(
              'Property label was not provided.')
          })  
        })
      })

      describe('segments missing', function() {
        beforeEach(function() {
          delete options.days[0].segments
        })

        parseError(function() {
          it('complains about segments', function() {
            error.message.should.equal(
              'Property segments was not provided.')
          })  
        })
      })

      describe('daytime segment missing', function() {
        beforeEach(function() {
          delete options.days[0].segments.daytime
        })

        parseError(function() {
          it('complains about daytime', function() {
            error.message.should.equal(
              'Property daytime was not provided.')
          })  
        })
      })

      describe('evening segment missing', function() {
        beforeEach(function() {
          delete options.days[0].segments.evening
        })

        parseError(function() {
          it('complains about evening', function() {
            error.message.should.equal(
              'Property evening was not provided.')
          })  
        })
      })      
    })

    describe('segment parsing', function() {
      parseResult(function() {
        it('parsing label (daytime)', function() {
          overview.days()[0].segments.daytime.label().should.equal('Daytime');
        })

        it('parsing label (evening)', function() {
          overview.days()[0].segments.evening.label().should.equal('Evening');
        })
      })

      describe('persons removed', function() {
        beforeEach(function() {
          delete options.days[0].segments.evening.persons
        })

        parseError(function() {
          it('should complain about lack of persons', function() {
            error.message.should.equal('Property persons was not provided.')
          })
        })
      })

      describe('label removed', function() {
        beforeEach(function() {
          delete options.days[0].segments.evening.label
        })

        parseError(function() {
          it('should complain about lack of label', function() {
            error.message.should.equal('Property label was not provided.')
          })
        })
      })
    })

    describe('person parsing', function() {
      var person;
      beforeEach(function() {
        person = options.days[0].segments.evening.persons[0]
      })

      describe('lacks id', function() {
        beforeEach(function() {
          delete person.id
        })

        parseError(function() {
          it('should complain', function() {
            error.message.should.equal('Property id was not provided.')
          })
        })
      })

      describe('lacks look', function() {
        beforeEach(function() {
          person.look = undefined
        })

        parseError(function() {
          it('should complain', function() {
            error.message.should.equal('Property look was not provided.')
          })
        })
      })

      describe('lacks imageSrc', function() {
        beforeEach(function() {
          delete person.imageSrc
        })

        parseError(function() {
          it('should complain', function() {
            error.message.should.equal('Property imageSrc was not provided.')
          })
        })
      })

      describe('lacks label', function() {
        beforeEach(function() {
          delete person.label
        })

        parseError(function() {
          it('should complain', function() {
            error.message.should.equal('Property label was not provided.')
          })
        })
      })

      parseResult(function() {
        var p; // PersonViewModel instance
        beforeEach(function() {
          p = overview.days()[0].segments.evening.persons()[0];
        })

        it('assigns look', function() {
          p.look().should.equal('free');
        })  

        it('assigns imageSrc', function() {
          p.imageSrc().should.equal('image.png');
        })

        it('body', function() {
          p.tooltip.body().should.equal(
            '<p><em>Fredrik</em> is <strong>free</strong> during ' +
            '<em>daytime</em> this <em>Monday</em></p>\n')
        })

        it('hidden per default', function() {
          p.tooltip.isVisible().should.equal(false)
        })

        describe('mouseover', function() {
          beforeEach(function() {
            p.mouseover()
          })

          it('shows tooltip', function() {
            p.tooltip.isVisible().should.equal(true)
          })

          describe('mouseout', function() {
            beforeEach(function() {
              p.mouseout()
            })

            it('hides tooltip', function() {
              p.tooltip.isVisible().should.equal(false)
            })                    
          })
        }) 

        describe('clicked', function() {
          beforeEach(function() {
            p.clicked();
          })

          it('dispatched event with proper type', function() {
            events[0].type.should.equal('person_clicked')
          })

          it('dispatched event with proper id', function() {
            events[0].id.should.equal('person987')
          })
          
        }) 
      })
    })
  })
})
})