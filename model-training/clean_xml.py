import os
import xml.etree.ElementTree as ET


def remove_missing_files(xml_file):
    # Load the XML file
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Find the 'images' tag
    images = root.find("images")

    # List to keep track of images to remove
    to_remove = []

    # Iterate over all the images in the XML file
    for image in images.findall("image"):
        file_path = image.get("file")

        # Check if the file exists
        if not os.path.exists(file_path):
            print(f"Removing missing file: {file_path}")
            to_remove.append(image)

    # Remove the images that do not have a corresponding file
    for image in to_remove:
        images.remove(image)

    # Save the cleaned XML file
    tree.write(xml_file)
    print(f"Cleaned XML saved as: {xml_file}")


# Replace with the path to your XML file
xml_file = "labels_ibug_300W_train_eyes.xml"
remove_missing_files(xml_file)
xml_file = "labels_ibug_300W_test_eyes.xml"
remove_missing_files(xml_file)
