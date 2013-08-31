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

  var afterParsing = function(targetName, fn) {
    describe('after parsing ' + targetName, function() {
      beforeEach(function() { 
        try      { overview = new OverviewModel(options) } 
        catch(e) { error = e } 
      }) 
      fn()
    })
  }

  var parseResult = function(fn) {
    describe('after parsing for result', function() {
      beforeEach(function() {
        overview = new OverviewModel(options)
      })
      fn()
    })
  }

  var pit = function(description, fn) {
    parseResult(function() { it(description, fn) })
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

  describe('Overview (parsing errors)', function() {
    describe('undefined provided', function() {
      beforeEach(function() {
        overview = undefined;
      })

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
      afterParsing('', function() {
        it('complains about days', function() {
          error.message.should.equal('Property days was not provided.')
        })
      })      
    })
  })

  describe('Day (parsing errors)', function() {
    var day;
    describe('No properties provided', function() {
      beforeEach(function() {
        day = {}
        options = { days: [ day ] }
      })

      afterParsing('', function() {
        it('complains about heading', function() {
          error.message.should.equal('Property heading was not provided.')  
        })  
      })

      describe('heading defined', function() {
        beforeEach(function() {
          day.heading = "Today, Monday"
        })

        afterParsing('', function() {
          it('complains about subheading', function() {
            error.message.should.equal(
              'Property subheading was not provided.')
          })
        })

        describe('defines subheading', function() {
          beforeEach(function() {
            day.subheading = "23 August"
          })

          afterParsing('', function() {
            it('should complain about lack of segments', function() {
              error.message.should.equal(
                'Property segments was not provided.')  
            })  
          })

          describe('empty segments', function() {
            var segments;
            beforeEach(function() {
              segments = day.segments = {}
            })

            afterParsing('', function() {
              it('should complain about lack of evening', function() {
                error.message.should.equal('Property evening was not provided.')
              })
            })

            describe('complete evening segment provided', function() {
              beforeEach(function() {
                segments.evening = { persons: [] }
              })

              afterParsing('', function() {
                it('should complain about daytime property', function() {
                  error.message.should.equal('Property daytime was not provided.')
                })  
              })
            })
          })  
        })          
      })
    })
  })

  describe('Segment (parsing errors)', function() {
    var segment;
    beforeEach(function() {
      segment = {}
      options = {
        days: [{
          heading: 'x', subheading: 'y',
          segments: {
            evening: segment, // assigning to both for test simplicty
            daytime: segment
          }
        }]
      }
    })

    parseError(function() {
      it('should complain about lack of persons', function() {
        error.message.should.equal('Property persons was not provided.')
      })
    })

    describe('persons defined', function() {
      beforeEach(function() {
        segment.persons = []
      })

      parseError(function() {
        it('should complain about lack of heading', function() {
          error.message.should.equal('Property heading was not provided.')
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

    parseResult(function() {
      it('parses first day (heading)', function() {
        overview.days()[0].heading()   .should.equal("Tomorrow")
      })

      it('parses first day(subheading)', function() {
        overview.days()[0].subheading().should.equal("August 21")
      })

      it('should have have created daytime overview', function() {
        overview.days()[0].segments.daytime.heading().should.equal('Daytime');
      })

      it('should have have created evening overview', function() {
        overview.days()[0].segments.evening.heading().should.equal('Evening');
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