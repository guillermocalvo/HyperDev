// section.last-week
//   h2 Last Week
//   p.topic= lastTopic

// ul.last-week
//   each drawing in drawingsInLastWeek
//     li
//       img.art(src="#{drawing}" width="80" height="80")

      # thisWeek = "/#{moment().year()}-#{moment().week()}/"
      # db.collection('Drawings').find
      #   $text:
      #     $search: thisWeek
      # .forEach (doc) ->
      #   console.log 'hi'
      #   console.log doc
      # lists out drawings 
      # (grouped by feelings) 
        # with creation date week that matches moment.week - 1

