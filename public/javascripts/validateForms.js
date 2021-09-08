(function () {
        "use strict";

        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll(".validated-form");

        // Loop over them and prevent submission
        //older way to turn it into an array
        //  Array.prototype.slice.call(forms)
        // new way is doing Array.from
        Array.from(forms).forEach(function (form) {
          form.addEventListener(
            "submit",
            function (event) {
              if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
              }

              form.classList.add("was-validated");
            },
            false
          );
        });
      })();