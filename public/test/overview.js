define(['/viewmodels/overview.js'], function(OverviewModel) {

  describe('OverViewModel', function() {
    var options;
    var viewmodel;
    beforeEach(function() {
      options = {};
    })

    var afterParsing = function(targetName, fn) {
      describe('after parsing ' + targetName, function() {
        beforeEach(function() { viewmodel = new OverviewModel(options); }) 
        fn()
      })
    }

    describe('Input errors', function() {

      it('heading not provided', function() {
        (function() {
          new OverviewModel(options)
        }).should.throw('Property days was not provided.')
      })

      describe('heading not defined', function() {
        
        beforeEach(function() {
          options.days = [ { }]
        })
        
        it('should error', function() {
          (function() {
            new OverviewModel(options)
          }).should.throw('Property heading was not provided.')  
        })
        
      })

      describe('subheading not defined', function() {
        
        beforeEach(function() {
          options.days = [ { heading: 'x' } ]
        })
        
        it('should error', function() {
          (function() {
            new OverviewModel(options)
          }).should.throw('Property subheading was not provided.')  
        })
        
      })
    })


    describe('days defined', function() {
      beforeEach(function() {
        options.days = [ 
          { heading: "Today, Monday",     subheading: "26 Aug" },
          { heading: "Tomorrow, Tuesday", subheading: "27 Aug" },
        ]
      })

      it('should complain about lack of segments', function() {
        (function() {
            new OverviewModel(options)
          }).should.throw('Property segments was not provided.')  
      })

      describe('segments added', function() {
        beforeEach(function() {
          options.days[0].segments = []
          options.days[1].segments = []
        })
        

        afterParsing('days', function() {

          it('parses first day (heading)', function() {
            viewmodel.days()[0].heading()   .should.equal("Today, Monday")
          })

          it('parses first day(subheading)', function() {
            viewmodel.days()[0].subheading().should.equal("26 Aug")
          })

          it('parses second day (heading)', function() {
            viewmodel.days()[1].heading().should.equal("Tomorrow, Tuesday")
          })

          it('parses second day (subheading)', function() {
            viewmodel.days()[1].subheading().should.equal("27 Aug")
          })

        })

        describe('and has an evening and daytime segment', function() {
          beforeEach(function() {
            options.days[1].segments = [
              { type: 'daytime' },
              { type: 'evening' }
            ]
          })

          afterParsing('segments', function() {

            it('should have empty persons', function() {
              viewmodel.days()[1].segments()[0].persons().length.should.equal(0)
            })
            
            it('should have have created daytime viewmodel', function() {
              viewmodel.days()[1].segments()[0].type().should.equal('daytime');
            })

            it('should have have created evening viewmodel', function() {
              viewmodel.days()[1].segments()[1].type().should.equal('evening');
            })
            
          })
          
        
          describe('and has persons defined on the evening segment', function() {
            beforeEach(function() {
              options.days[1].segments[1].persons = [
                {
                  type: 'free',
                  imageSrc: '/images/test/fredrik.jpg',
                  description: '*Fredrik* is **free** during *daytime* this *Monday*',
                }
              ]
            })

            afterParsing('person', function() {
              it('assigns type', function() {
                viewmodel.days()[1].segments()[1].persons()[0].type().should.equal('free');
              })  

              it('assigns imageSrc', function() {
                viewmodel.days()[1].segments()[1].persons()[0].
                  imageSrc().should.equal('/images/test/fredrik.jpg');
              })

              it('assigns description', function() {
                viewmodel.days()[1].segments()[1].persons()[0].
                  description().should.
                    equal('<p><em>Fredrik</em> is <strong>free</strong> during <em>daytime</em> this <em>Monday</em></p>\n');
              })
            })

          })
        })

        
        
      })

    })

  })

})