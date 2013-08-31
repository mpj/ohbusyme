define(['/viewmodels/overview.js'], function(OverviewModel) {
describe('Parsing entire OverviewModel', function() {
  
  var options;
  var overview;
  var error;
  beforeEach(function() {
    options = undefined;
    overview = undefined;
    error = undefined;
  })

  var parseResult = function(fn) {
    describe('after parsing for result', function() {
      beforeEach(function() {
        overview = new OverviewModel(options)
      })
      fn()
    })
  }

  var parseError = function(fn) {
    describe('after parsing for error', function() {
      beforeEach(function() {
        try       { new OverviewModel(options) } 
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
          heading: 'Tomorrow',
          subheading: 'August 21',
          segments: {
            daytime: {
              heading: 'Daytime',
              persons: []
            },
            evening: {
              heading: 'Evening',
              persons: [{
                imageSrc: 'image.png',
                type: 'free',
                description: '*Fredrik* is **free** during *daytime* this *Monday*'
              }]
            }
          }
        }]
      }
    })

    describe('day parsing', function() {

      parseResult(function() {
        it('parses first day (heading)', function() {
          overview.days()[0].heading()   .should.equal("Tomorrow")
        })
      })

      describe('heading missing', function() {
        beforeEach(function() {
          delete options.days[0].heading
        })

        parseError(function() {
          it('complains about heading', function() {
            error.message.should.equal(
              'Property heading was not provided.')
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
        it('should have have created daytime overview', function() {
          overview.days()[0].segments.daytime.heading().should.equal('Daytime');
        })

        it('should have have created evening overview', function() {
          overview.days()[0].segments.evening.heading().should.equal('Evening');
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

      describe('heading removed', function() {
        beforeEach(function() {
          delete options.days[0].segments.evening.heading
        })

        parseError(function() {
          it('should complain about lack of heading', function() {
            error.message.should.equal('Property heading was not provided.')
          })
        })
      })
    })

    describe('person parsing', function() {
      var person;
      beforeEach(function() {
        person = options.days[0].segments.evening.persons[0]
      })

      describe('lacks type', function() {
        beforeEach(function() {
          person.type = undefined
        })

        parseError(function() {
          it('should complain', function() {
            error.message.should.equal('Property type was not provided.')
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

      describe('lacks description', function() {
        beforeEach(function() {
          delete person.description
        })

        parseError(function() {
          it('should complain', function() {
            error.message.should.equal('Property description was not provided.')
          })
        })
      })

      parseResult(function() {
        var p; // PersonViewModel instance
        beforeEach(function() {
          p = overview.days()[0].segments.evening.persons()[0];
        })

        it('assigns type', function() {
          p.type().should.equal('free');
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
      })
    })
  })
})
})