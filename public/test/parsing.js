define(['/viewmodels/overview.js'], function(OverviewModel) {

  describe('Parsing entire OverviewModel', function() {
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

          it('should complain about lack of persons', function() {
            (function() {
              new OverviewModel(options)
            }).should.throw('Property persons was not provided.')  
          })


          describe('empty persons assigned', function() {
            beforeEach(function() {
              options.days[1].segments[0].persons = [];
              options.days[1].segments[1].persons = [];
            })

            it('should complain about lack of heading', function() {
              (function() {
                new OverviewModel(options)
              }).should.throw('Property heading was not provided.')  
            })

            describe('when heading defined', function() {
              beforeEach(function() {
                options.days[1].segments[0].heading = 'a heading'
                options.days[1].segments[1].heading = 'another heading'
              })

              afterParsing('segments', function() {
                
                it('should have have created daytime viewmodel', function() {
                  viewmodel.days()[1].segments()[0].type().should.equal('daytime');
                })

                it('should have have created evening viewmodel', function() {
                  viewmodel.days()[1].segments()[1].type().should.equal('evening');
                })

              })
            })
          })

          describe('empty object defined as a person', function () {
            var p;
            beforeEach(function() {
              p = {};
              options.days[1].segments[0].heading = "some heading"
              options.days[1].segments[1].heading = "some other heading"
              options.days[1].segments[0].persons = [p]
              options.days[1].segments[1].persons = []

            })

            it('should complain about lack of type', function() {
              (function() {
                new OverviewModel(options)
              }).should.throw('Property type was not provided.')  
            })

            describe('we define the type', function() {
              beforeEach(function() {
                p.type = 'free'
              })

              it('should complain about lack of imageSrc', function () {
                (function() {
                  new OverviewModel(options)
                }).should.throw('Property imageSrc was not provided.')  
              })

              describe('we define the imageSrc property', function() {
                beforeEach(function() {
                  p.imageSrc = "http://test.com/image.png";
                })

                it('should complain about description', function() {
                  (function() {
                    new OverviewModel(options)
                  }).should.throw('Property description was not provided.') 
                })
              })
            })

          })

          
          
        
          describe('and has persons defined on the evening segment', function() {
            beforeEach(function() {
              options.days[1].segments[0].heading = "some heading"
              options.days[1].segments[1].heading = "some other heading"
              options.days[1].segments[0].persons = []
              options.days[1].segments[1].persons = [
                {
                  type: 'free',
                  imageSrc: '/images/test/fredrik.jpg',
                  description: '*Fredrik* is **free** during *daytime* this *Monday*',
                }
              ]
            })

            afterParsing('person', function() {
              var person;
              beforeEach(function() {
                person = viewmodel.days()[1].segments()[1].persons()[0]
              })

              it('should have the headings', function() {
                viewmodel.days()[1].segments()[1].heading().
                  should.equal("some other heading")
              })

              it('assigns type', function() {
                person.type().should.equal('free');
              })  

              it('assigns imageSrc', function() {
                person.imageSrc().should.equal('/images/test/fredrik.jpg');
              })

              describe('tooltip', function() {

                it('body', function() {
                  person.tooltip.body().should.equal(
                    '<p><em>Fredrik</em> is <strong>free</strong> during ' +
                    '<em>daytime</em> this <em>Monday</em></p>\n')
                })

                it('hidden per default', function() {
                  person.tooltip.isVisible().should.equal(false)
                })

                describe('mouseover', function() {
                  beforeEach(function() {
                    person.mouseover()
                  })

                  it('shows tooltip', function() {
                    person.tooltip.isVisible().should.equal(true)
                  })

                  describe('mouseout', function() {
                    beforeEach(function() {
                      person.mouseout()
                    })

                    it('hides tooltip', function() {
                      person.tooltip.isVisible().should.equal(false)
                    })                    
                  })
                })
              })
            })

          })
        })

        
        
      })

    })

  })

})