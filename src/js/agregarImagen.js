import { Dropzone } from 'dropzone'

const token = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute('content')

//reescribir el objeto
Dropzone.options.imagen = {
  dictDefaultMessage: 'Sube tus imágenes aquí',
  acceptedFiles: '.png, .jpg, .jpeg',
  maxFilesize: 5,
  maxFiles: 1,
  parallelUploads: 1,
  autoProcessQueue: false,
  addRemoveLinks: true,
  dictRemoveFile: 'Borrar Archivo',
  dictMaxFilesExceeded: 'El límite es 1 archivo',
  headers: {
    'CSRF-TOKEN': token,
  },
  paramName: 'imagen',
  init: function () {
    //sobreescribo el comportamiento de dropzone
    const dropzone = this
    const btnPublicar = document.querySelector('#publicar')

    btnPublicar.addEventListener('click', function () {
      dropzone.processQueue()
    })

    //Este evento detecta que todo se ejecuto correctamente y que redireccione si no quedan archivos en cola
    dropzone.on('queuecomplete', function () {
      if (dropzone.getActiveFiles().length == 0) {
        window.location.href = '/mis-propiedades'
      }
    }) //eventos de dropzone
  },
}
