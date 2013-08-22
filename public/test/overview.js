define(['/viewmodels/overview.js'], function(OverviewModel) {

  describe('OverViewModel', function() {
    var options;
    var viewmodel;
    describe('empty options', function() {
      options = {};
    })

    describe('Input errors', function() {

      it('days not provided', function() {
        (function() {
          new OverviewModel(options)
        }).should.throw('Property days was not provided.')
      })
    })

    describe('days defined', function() {
      beforeEach(function() {
        options.days = [ 
          { date: "2013-01-21" },
          { date: "2013-02-01" },
        ]
      })

      describe('after parsing', function() {
        beforeEach(function() { viewmodel = new OverviewModel(options); }) 

        it('parses first day', function() {
          viewmodel.days()[0].heading().should.equal("Jan 21st")
        })

        it('parses second day', function() {
          viewmodel.days()[1].heading().should.equal("Feb 1st")
        })
      })

      describe('day segment defined with people', function() {
        
      })

    })
      
    it('Basic parsing', function() {
      var overview = new OverviewModel({
        days: [
          { date: "2013-01-21",
            segments: {
              "day": {
                people: [
                  {
                    style: 'free',
                    tooltipText: '*You* are shown as **often free** during *daytime* on *Mondays*.'
                  },
                  {
                    style: 'busy',
                    tooltipText: '*Louise* is **busy** during *daytime* this *Monday*.'
                  }

                ]
              }
            }
            

          },
          { date: "2013-02-1" }
        ]
      })

      
    })

    


  })

})